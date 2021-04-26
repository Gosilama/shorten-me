import { connectToDatabase } from "./_connector";

export default async (req, res) => {
    const db = await connectToDatabase();

    const entry = await db.db(process.env.DB_NAME).collection('links').findOne({ shortLinkId: req.query.id as string });

    if (entry !== null) {
        return res.redirect(301, entry.shortLink);
    }

    return res.redirect(301, '/');
}
