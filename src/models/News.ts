import { Schema, model, models } from "mongoose";

const newsSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const News = models.News || model("News", newsSchema);

export default News;
