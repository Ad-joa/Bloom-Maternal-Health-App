"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
                content: 'Eating small, frequent meals can help ease nausea. Keep crackers by your bed and try ginger tea.',
                category: 'article',
                type: 'article',
                author: 'Dr. Jane Smith',
                duration: '5 min read',
                image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80',
                trimester: 1,
            },
            {
                title: 'Understanding Braxton Hicks',
                content: 'These practice contractions are completely normal. They are usually irregular and painless.',
                category: 'article',
                type: 'article',
                author: 'Nurse Emma',
                duration: '4 min read',
                image_url: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=400&q=80',
                trimester: 3,
            },
            {
                title: 'Managing Blood Pressure Naturally',
                content: 'Tips for those dealing with hypertension or preeclampsia symptoms. Stay hydrated, reduce sodium, and monitor closely.',
                category: 'article',
                type: 'article',
                author: 'Dr. John Doe',
                duration: '5 min read',
                image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80',
            },
            {
                title: 'Asthma Management in Pregnancy',
                content: 'How to ensure you and your baby get enough oxygen. Continue your prescribed inhalers and avoid known triggers.',
                category: 'article',
                type: 'article',
                author: 'Dr. Sarah Lee',
                duration: '4 min read',
                image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
            },
            {
                title: 'The Importance of Hydration',
                content: 'Why drinking enough water is crucial for you and your baby. Aim for at least 8-12 glasses a day.',
                category: 'article',
                type: 'article',
                author: 'Dietitian Clara',
                duration: '4 min read',
                image_url: 'https://images.unsplash.com/photo-1490818387583-1b5ba4596956?auto=format&fit=crop&w=400&q=80',
            },
            {
                title: 'Sleeping Positions for 3rd Trimester',
                content: 'Tips and tricks to get comfortable when your belly is growing. Sleep on your left side to improve blood flow.',
                category: 'article',
                type: 'article',
                author: 'Nurse Emma',
                duration: '6 min read',
                image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
                trimester: 3,
            },
            {
                title: 'Hospital Bag Checklist',
                content: 'Everything you need to pack for the big day, for you, your partner, and the baby.',
                category: 'article',
                type: 'article',
                author: 'Mama Tips',
                duration: '4 min read',
                image_url: 'https://images.unsplash.com/photo-1555243896-771a8239ac20?auto=format&fit=crop&w=400&q=80',
                trimester: 3,
            },
            // Videos
            {
                title: 'Prenatal Yoga - First Trimester',
                content: 'Gentle stretches for your first trimester to ease tension and improve circulation.',
                category: 'video',
                type: 'video',
                author: 'Yoga with Anna',
                duration: '20 mins',
                image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
                trimester: 1,
            },
            {
                title: 'Preparing Your Hospital Bag',
                content: 'What you actually need to pack. A visual guide to the essentials.',
                category: 'video',
                type: 'video',
                author: 'Mama Tips',
                duration: '12 mins',
                image_url: 'https://images.unsplash.com/photo-1555243896-771a8239ac20?auto=format&fit=crop&w=600&q=80',
                trimester: 3,
            },
            {
                title: 'Pelvic Floor Exercises',
                content: 'Learn how to do Kegels correctly to strengthen your pelvic floor.',
                category: 'video',
                type: 'video',
                author: 'Dr. Sarah',
                duration: '15 mins',
                image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
            },
            {
                title: 'Signs of Labor Approaching',
                content: 'What to look for as your due date nears.',
                category: 'video',
                type: 'video',
                author: 'Nurse Emma',
                duration: '8 mins',
                image_url: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=600&q=80',
                trimester: 3,
            },
            {
                title: 'How to Breastfeed: A Beginner\'s Guide',
                content: 'Basics of latching, positioning, and milk supply.',
                category: 'video',
                type: 'video',
                author: 'Lactation Consultant',
                duration: '18 mins',
                image_url: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=600&q=80',
                trimester: 3,
            },
            // Audio
            {
                title: 'Weeks 22-24: The Move',
                content: 'Discussing the changes in the second trimester and feeling the baby move.',
                category: 'audio',
                type: 'audio',
                author: 'Becca Bristow',
                duration: '28 mins',
                image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
                media_url: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3',
                trimester: 2,
            },
            {
                title: 'Caring for Twins',
                content: 'Everything you need to know about carrying and preparing for twins.',
                category: 'audio',
                type: 'audio',
                author: 'Dad\'s Guide to Twins',
                duration: '35 mins',
                image_url: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=400&q=80',
                media_url: 'https://traffic.libsyn.com/twindad/dads-guide-to-twins-episode-17.mp3',
            },
            {
                title: 'Pregnancy Health & Nutrition',
                content: 'What to eat to support your growing baby.',
                category: 'audio',
                type: 'audio',
                author: 'Becca Bristow',
                duration: '50 mins',
                image_url: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?auto=format&fit=crop&w=400&q=80',
                media_url: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3',
            },
            {
                title: 'Navigating Hospital Births',
                content: 'What to expect when you arrive at the hospital in labor.',
                category: 'audio',
                type: 'audio',
                author: 'Dad\'s Guide to Twins',
                duration: '40 mins',
                image_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&q=80',
                media_url: 'https://traffic.libsyn.com/twindad/dads-guide-to-twins-episode-17.mp3',
                trimester: 3,
            },
            {
                title: 'Mindful Hypnobirthing',
                content: 'Techniques for a calm and focused labor.',
                category: 'audio',
                type: 'audio',
                author: 'Hollie de Cruz',
                duration: '55 mins',
                image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
                media_url: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3',
                trimester: 3,
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
            },
            {
                title: 'Ina May\'s Guide to Childbirth',
                content: 'Empowering stories and practical advice for natural childbirth.',
                category: 'book',
                type: 'book',
                author: 'Ina May Gaskin',
                duration: '348 pages',
                image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
            },
            {
                title: 'The Fourth Trimester',
                content: 'A Postpartum Guide to Healing Your Body, Balancing Your Emotions, and Restoring Your Vitality.',
                category: 'book',
                type: 'book',
                author: 'Kimberly Ann Johnson',
                duration: '288 pages',
                image_url: 'https://images.unsplash.com/photo-1524909623862-2bd3fb895e6f?auto=format&fit=crop&w=400&q=80',
            },
            {
                title: 'Real Food for Pregnancy',
                content: 'The science and wisdom of optimal prenatal nutrition.',
                category: 'book',
                type: 'book',
                author: 'Lily Nichols',
                duration: '354 pages',
                image_url: 'https://images.unsplash.com/photo-1490818387583-1b5ba4596956?auto=format&fit=crop&w=400&q=80',
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
//# sourceMappingURL=seed.js.map