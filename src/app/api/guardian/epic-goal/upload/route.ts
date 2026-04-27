import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.user.role !== 'GUARDIAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const studentId = formData.get('studentId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Diretório: public/MetasEpica/[studentId]
    const relativePath = `MetasEpica/${studentId}`;
    const publicPath = join(process.cwd(), 'public', relativePath);

    // Garantir que a pasta existe
    await mkdir(publicPath, { recursive: true });

    const fileName = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;
    const filePath = join(publicPath, fileName);

    await writeFile(filePath, buffer);

    const imageUrl = `/${relativePath}/${fileName}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
