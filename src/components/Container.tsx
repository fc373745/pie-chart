import React, { useState, useEffect } from "react";
import firebase from "firebase";
import config from "./CONFIG_VARS";

import AddForm from "./AddForm";
import List from "./List";
import { PieChart } from "./PieChart";

firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

export interface Datum {
    name: string;
    price: number;
}
export interface FullDatum extends Datum {
    id: string;
}

export const Container: React.FunctionComponent = () => {
    const [updated, setUpdate] = useState(false);
    const [list, setList] = useState<FullDatum[]>([]);

    useEffect(() => {
        if (!updated) {
            db.collection("expenses")
                .get()
                .then(res => {
                    let data: FullDatum[] = [];
                    res.docs.forEach(doc => {
                        let fullDocument = doc.data();
                        fullDocument.id = doc.id;
                        data.push(fullDocument as FullDatum);
                    });
                    setUpdate(true);
                    setList(data);
                });
        }
    });
    return (
        <div>
            <PieChart list={list} />
            <AddForm db={db} setUpdate={setUpdate} />
            <List db={db} list={list} setUpdate={setUpdate} />
        </div>
    );
};
