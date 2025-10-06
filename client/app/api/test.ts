import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
export default function handler(req : NextApiRequest, res : NextApiResponse) {
    axios
        .get("http://localhost:8000/test")
        .then((response) => {
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
}