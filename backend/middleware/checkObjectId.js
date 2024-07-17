// @ts-check
import { isValidObjectId as isValidId } from 'mongoose';

function checkObjectId(req, res, next) {
  if (!isValidId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid ObjectId: ${req.params.id}`);
  }
  next();
}

export default checkObjectId;
