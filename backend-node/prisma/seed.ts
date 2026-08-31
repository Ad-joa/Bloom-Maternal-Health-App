import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing seed data...');
  await prisma.hospitals.deleteMany();
  await prisma.educational_content.deleteMany();

  console.log('Seeding hospitals...');
  await prisma.hospitals.createMany({
    data: [
      {
        name: 'Ridge Hospital',
        address: 'Castle Rd, Accra',
        distance: '2.5 km',
        phone: '+233 30 222 8382',
        rating: 4.2,
        wait_time: '15 mins',
      },
      {
        name: 'Korle-Bu Teaching Hospital',
        address: 'Guggisberg Ave, Accra',
        distance: '4.1 km',
        phone: '+233 30 266 7759',
        rating: 4.5,
        wait_time: '25 mins',
      },
      {
        name: 'Nyaho Medical Centre',
        address: '35 Airport Bypass Rd, Accra',
        distance: '5.8 km',
        phone: '+233 30 277 5341',
        rating: 4.8,
        wait_time: '10 mins',
      },
      {
        name: 'Lister Hospital',
        address: 'Airport Hills, Accra',
        distance: '8.2 km',
        phone: '+233 30 281 2325',
        rating: 4.7,
        wait_time: '12 mins',
      }
    ],
  });

  console.log('Seeding educational content...');
  await prisma.educational_content.createMany({
    data: [
      // Articles
      {
        title: 'Morning Sickness: What Helps',
        content: 'Eating small, frequent meals can help ease nausea...',
        category: 'article',
        type: 'article',
        author: 'Dr. Jane Smith',
        duration: '5 min read',
        image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80',
        trimester: 1,
      },
      {
        title: 'Understanding Braxton Hicks',
        content: 'These practice contractions are completely normal...',
        category: 'article',
        type: 'article',
        author: 'Nurse Emma',
        duration: '4 min read',
        image_url: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=400&q=80',
        trimester: 3,
      },
      // Videos
      {
        title: 'Prenatal Yoga - First Trimester',
        content: 'Gentle stretches for your first trimester.',
        category: 'video',
        type: 'video',
        author: 'Yoga with Anna',
        duration: '20 mins',
        image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      },
      {
        title: 'Preparing Your Hospital Bag',
        content: 'What you actually need to pack.',
        category: 'video',
        type: 'video',
        author: 'Mama Tips',
        duration: '12 mins',
        image_url: 'https://images.unsplash.com/photo-1555243896-771a8239ac20?auto=format&fit=crop&w=600&q=80',
      },
      // Audio
      {
        title: 'Weeks 22-24: The Move',
        content: 'Discussing the changes in the second trimester.',
        category: 'audio',
        type: 'audio',
        author: 'Becca Bristow',
        duration: '28 mins',
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
        media_url: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3',
      },
      {
        title: 'Caring for Twins',
        content: 'Everything you need to know about carrying twins.',
        category: 'audio',
        type: 'audio',
        author: 'Dad\'s Guide to Twins',
        duration: '35 mins',
        image_url: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=400&q=80',
        media_url: 'https://traffic.libsyn.com/twindad/dads-guide-to-twins-episode-17.mp3',
      },
      // Books
      {
        title: 'Expecting Better',
        content: 'Why the Conventional Pregnancy Wisdom Is Wrong.',
        category: 'book',
        type: 'book',
        author: 'Emily Oster',
        duration: '320 pages',
        image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80',
      },
      {
        title: 'The Mama Natural',
        content: 'Week-by-Week Guide to Pregnancy and Childbirth.',
        category: 'book',
        type: 'book',
        author: 'Genevieve Howland',
        duration: '450 pages',
        image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80',
      }
    ],
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
