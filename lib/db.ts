import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export function dbConnect() {
  if (!global._mongooseConn) {
    mongoose.set("strictQuery", true);
    global._mongooseConn = mongoose.connect(MONGODB_URI);
  }
  return global._mongooseConn;
}
