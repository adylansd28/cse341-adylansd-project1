import { ObjectId } from "mongodb";
import { getDb } from "../data/database.js";

const col = () => getDb().collection("workouts");
const users = () => getDb().collection("users");
const isId = (id) => ObjectId.isValid(id);

export async function listWorkouts(req, res, next) {
  try {
    const { userId, from, to } = req.query;
    const q = {};
    if (userId && isId(userId)) q.userId = new ObjectId(userId);
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = from;
      if (to) q.date.$lte = to;
    }
    const items = await col().find(q).toArray();
    res.json(items);
  } catch (err) { next(err); }
}

export async function getWorkoutById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: "Invalid id" });
    const item = await col().findOne({ _id: new ObjectId(id) });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) { next(err); }
}

export async function createWorkout(req, res, next) {
  try {
    const payload = req.body;
    // ensure user exists
    const exists = await users().findOne({ _id: new ObjectId(payload.userId) });
    if (!exists) return res.status(400).json({ message: "userId not found" });

    const { insertedId } = await col().insertOne(payload);
    res.status(201).json({ _id: insertedId, ...payload });
  } catch (err) { next(err); }
}

export async function updateWorkout(req, res, next) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: "Invalid id" });
    const { value } = await col().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnDocument: "after" }
    );
    if (!value) return res.status(404).json({ message: "Not found" });
    res.json(value);
  } catch (err) { next(err); }
}

export async function deleteWorkout(req, res, next) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: "Invalid id" });
    const { deletedCount } = await col().deleteOne({ _id: new ObjectId(id) });
    if (!deletedCount) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  } catch (err) { next(err); }
}
