import { ObjectId } from "mongodb";
import { getDb } from "../data/database.js";

const col = () => getDb().collection("users");
const isId = (id) => ObjectId.isValid(id);

export async function listUsers(req, res, next) {
  try {
    const items = await col().find().toArray();
    res.json(items);
  } catch (err) { next(err); }
}

export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: "Invalid id" });
    const item = await col().findOne({ _id: new ObjectId(id) });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) { next(err); }
}

export async function createUser(req, res, next) {
  try {
    const payload = req.body;
    payload.createdAt = payload.createdAt || new Date().toISOString();
    const { insertedId } = await col().insertOne(payload);
    res.status(201).json({ _id: insertedId, ...payload });
  } catch (err) { next(err); }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: "Invalid id" });

    const _id = new ObjectId(id);
    const result = await col().updateOne({ _id }, { $set: req.body });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const updated = await col().findOne({ _id });
    res.status(200).json(updated);
  } catch (err) { next(err); }
} 

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: "Invalid id" });
    const { deletedCount } = await col().deleteOne({ _id: new ObjectId(id) });
    if (!deletedCount) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  } catch (err) { next(err); }
}