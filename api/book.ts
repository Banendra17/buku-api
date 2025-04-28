// api/books.ts
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("bookdb");  // nama database
  const collection = db.collection("books"); // nama collection

  if (req.method === "POST") {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: "Title and Author are required" });
    }
    const newBook = { title, author };
    await collection.insertOne(newBook);
    return res.status(201).json({ message: "Book added", book: newBook });
  }

  if (req.method === "GET") {
    const books = await collection.find({}).toArray();
    return res.status(200).json(books);
  }

  res.status(405).json({ message: "Method not allowed" });
}
