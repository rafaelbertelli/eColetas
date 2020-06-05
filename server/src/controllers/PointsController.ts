import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      longitude,
      latitude,
      city,
      uf,
      items,
    } = req.body;

    const point = {
      image: "image-fake",
      name,
      email,
      whatsapp,
      longitude,
      latitude,
      city,
      uf,
    };

    // const trx = await knex.transaction();
    const insertedIds = await knex("points").insert(point);
    const point_id = insertedIds[0];
    const pointItems = items.map((item_id: number) => ({ item_id, point_id }));
    await knex("point_items").insert(pointItems);

    return res.json({ id: point_id, ...point });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await knex("points").where("id", id).first();

    if (!point) {
      return res.status(400).json({ message: "point not found" });
    }

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id);

    return res.json({ point, items });
  }
}

export default PointsController;
