"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommunitySocket = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const setupCommunitySocket = (io) => {
    // Authentication Middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Authentication error: Token missing'));
        }
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
            if (err)
                return next(new Error('Authentication error: Invalid token'));
            socket.user = decoded;
            next();
        });
    });
    io.on('connection', async (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        // Send initial posts from database
        try {
            const posts = await prisma_1.default.community_posts.findMany({
                orderBy: { created_at: 'desc' },
                take: 50
            });
            // Emit raw posts without 'liked' state. The client will reconcile its own likes.
            socket.emit('init_posts', posts);
        }
        catch (error) {
            console.error("Error fetching posts:", error);
        }
        // Handle toggling like (Delta Update Approach)
        socket.on('toggle_like', async ({ postId, isLiked }) => {
            try {
                const updatedPost = await prisma_1.default.community_posts.update({
                    where: { id: postId },
                    data: { likes: isLiked ? { increment: 1 } : { decrement: 1 } }
                });
                // Broadcast lightweight delta update to ALL sockets (including sender)
                io.sockets.emit('post_liked', { postId, likes: updatedPost.likes });
            }
            catch (error) {
                console.error("Error toggling like:", error);
            }
        });
        // Handle new post
        socket.on('create_post', async (post) => {
            try {
                const newPost = await prisma_1.default.community_posts.create({
                    data: {
                        author: post.author,
                        week: post.week ?? null,
                        content: post.content,
                    }
                });
                // Broadcast lightweight delta update to ALL sockets
                io.sockets.emit('post_created', newPost);
            }
            catch (error) {
                console.error("Error creating post:", error);
            }
        });
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
exports.setupCommunitySocket = setupCommunitySocket;
//# sourceMappingURL=communitySocket.js.map