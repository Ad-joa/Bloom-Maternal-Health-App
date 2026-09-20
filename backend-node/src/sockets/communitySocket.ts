import { Server, Socket } from 'socket.io';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export const setupCommunitySocket = (io: Server) => {
  // Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) return next(new Error('Authentication error: Invalid token'));
      (socket as any).user = decoded;
      next();
    });
  });

  io.on('connection', async (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Send initial posts from database
    try {
      const posts = await prisma.community_posts.findMany({
        orderBy: { created_at: 'desc' },
        take: 50
      });
      // Emit raw posts without 'liked' state. The client will reconcile its own likes.
      socket.emit('init_posts', posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

    // Handle toggling like (Delta Update Approach)
    socket.on('toggle_like', async ({ postId, isLiked }: { postId: string, isLiked: boolean }) => {
      try {
        const updatedPost = await prisma.community_posts.update({
          where: { id: postId },
          data: { likes: isLiked ? { increment: 1 } : { decrement: 1 } }
        });

        // Broadcast lightweight delta update to ALL sockets (including sender)
        io.sockets.emit('post_liked', { postId, likes: updatedPost.likes });
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    });

    // Handle new post
    socket.on('create_post', async (post) => {
      try {
        const newPost = await prisma.community_posts.create({
          data: {
            author: post.author,
            week: post.week ?? null,
            content: post.content,
          }
        });

        // Broadcast lightweight delta update to ALL sockets
        io.sockets.emit('post_created', newPost);
      } catch (error) {
        console.error("Error creating post:", error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

