import { nanoid } from 'nanoid';
import validUrl from 'valid-url';
import { connectToDatabase } from "./_connector";

const generateShortenedUrl = (): { shortLinkId: string; shortLink: string } => {
    const shortLinkId = nanoid(6);
    return { shortLink: `${process.env.VERCEL_URL}/r/${shortLinkId}`, shortLinkId };
};

const response = ( res, code, data, error = '', description = '', isError = false ) => {
    res.statusCode = code;
    return isError ? res.json({ error, description }):res.json( data )
}

export default async (req, res) => {
    const db = await connectToDatabase();

    if (req.body.link == null || req.body.link === '') {
        response(res, 400, null, 'bad request', 'Bad request, check payload', true);
    }

    if (!validUrl.isUri(req.body.link)) {
        response(res, 400, null, 'invalid link', 'the link you entered isn\'t a valid link', true )
    }

    const { shortLink, shortLinkId } = generateShortenedUrl();
    console.log({ shortLink, shortLinkId });
    await db.db(process.env.DB_NAME).collection('links').insertOne({ link: req.body.link, shortLink, shortLinkId });

    return response(res, 201, { shortLink });
}
