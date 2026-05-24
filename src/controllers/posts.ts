import type { RequestHandler } from 'express';
import { slugify } from '../utils/slugify.js';
import { calculateReadTime } from '../utils/readTime.js';
import { truncate } from '../utils/truncate.js';
import { isValidPost } from '../utils/validate.js';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  readTime: number;
}

const posts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with Node.js',
    slug: 'getting-started-with-nodejs',
    content:
      'Node.js is a JavaScript runtime built on Chrome\'s V8 engine. ' +
      'word '.repeat(196).trim(),
    summary: 'An introduction to Node.js for backend developers.',
    readTime: 1,
  },
  {
    id: 2,
    title: 'Understanding Async/Await',
    slug: 'understanding-async-await',
    content:
      'Async/await is syntactic sugar over Promises in JavaScript. ' +
      'word '.repeat(196).trim(),
    summary: 'Learn how async/await simplifies asynchronous JavaScript.',
    readTime: 1,
  },
];

let nextId = posts.length + 1;

const getPosts: RequestHandler = (req, res) => {
  const summaries = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    readTime: p.readTime,
  }));
  res.status(200).json({ success: true, data: summaries, error: null });
};

const getPostById: RequestHandler = (req, res) => {
  const id = Number(req.params['id']);

  if (Number.isNaN(id)) {
    throw Object.assign(new Error(`"${req.params['id']}" is not a valid post ID`), {
      statusCode: 400,
    });
  }

  const post = posts.find((p) => p.id === id) ?? null;

  if (!post) {
    throw Object.assign(new Error(`Post with ID ${id} not found`), {
      statusCode: 404,
    });
  }

  res.status(200).json({ success: true, data: post, error: null });
};

const createPost: RequestHandler = (req, res) => {
  const body = req.body as { title?: string; content?: string };

  if (!isValidPost({ title: body.title ?? '', content: body.content ?? '' })) {
    throw Object.assign(
      new Error('Both title and content are required and must be non-empty'),
      { statusCode: 400 },
    );
  }

  const title = body.title as string;
  const content = body.content as string;

  const post: Post = {
    id: nextId++,
    title,
    slug: slugify(title),
    content,
    summary: truncate(content, 120),
    readTime: calculateReadTime(content),
  };

  posts.push(post);
  res.status(201).json({ success: true, data: post, error: null });
};

export { getPosts, getPostById, createPost };
