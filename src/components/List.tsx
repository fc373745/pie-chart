import React, { useState, useEffect } from "react";
import { FullDatum } from "./Container";

type Props = {
    db: firebase.firestore.Firestore;
    list: FullDatum[];
    setUpdate: (value: boolean) => void;
};

const List: React.FunctionComponent<Props> = props => {
    const del = (id: string) => {
        props.db
            .collection("expenses")
            .doc(id)
            .delete()
            .then(() => {
                props.setUpdate(false);
            });
    };
    return (
        <div>
            <ul>
                {props.list.map(item => {
                    return (
                        <li key={item.id}>
                            {item.name} | {item.price}
                            <button onClick={() => del(item.id)}>Delete</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default List;
