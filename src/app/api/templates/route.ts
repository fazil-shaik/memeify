import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { db } from '@/db';
import { templates } from '@/db/schema';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file || !name) {
      return NextResponse.json({ error: 'File and name are required' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary via stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'memegenerator' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const { secure_url, width, height } = uploadResult as any;

    // Save metadata to Neon DB
    const [newTemplate] = await db.insert(templates).values({
      name,
      imageUrl: secure_url,
      width,
      height,
      isApproved: true, // For admin uploads, auto-approve
    }).returning();

    return NextResponse.json(newTemplate);
  } catch (error) {
    console.error('Error uploading template:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

const defaultTemplates = [
  { id: 1001, name: "Drake Hotline Bling", imageUrl: "https://i.imgflip.com/30b1gx.jpg", width: 1200, height: 1200, isApproved: true },
  { id: 1002, name: "Distracted Boyfriend", imageUrl: "https://i.imgflip.com/1ur9b0.jpg", width: 1200, height: 800, isApproved: true },
  { id: 1003, name: "Two Buttons", imageUrl: "https://i.imgflip.com/1g8my4.jpg", width: 600, height: 908, isApproved: true },
  { id: 1004, name: "Change My Mind", imageUrl: "https://i.imgflip.com/24y43o.jpg", width: 482, height: 361, isApproved: true },
  { id: 1005, name: "Disaster Girl", imageUrl: "https://i.imgflip.com/23ls.jpg", width: 500, height: 375, isApproved: true },
  { id: 1006, name: "Left Exit 12 Off Ramp", imageUrl: "https://i.imgflip.com/22bdq6.jpg", width: 804, height: 767, isApproved: true },
  { id: 1007, name: "Batman Slapping Robin", imageUrl: "https://i.imgflip.com/9ehk.jpg", width: 400, height: 387, isApproved: true },
  { id: 1008, name: "Blank Nut Button", imageUrl: "https://i.imgflip.com/1yxkcp.jpg", width: 600, height: 446, isApproved: true }
];

export async function GET() {
  try {
    const allTemplates = await db.select().from(templates);
    if (allTemplates.length === 0) {
      return NextResponse.json(defaultTemplates);
    }
    return NextResponse.json([...allTemplates, ...defaultTemplates]); // Show both for prototype
  } catch (error) {
    console.error('Error fetching templates:', error);
    // If DB is not connected yet, fallback to defaults
    return NextResponse.json(defaultTemplates);
  }
}
