import React, { useState } from "react";
import firebase from "firebase";
import config from "./CONFIG_VARS";

import AddForm from "./AddForm";

firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

const Container: React.FunctionComponent = () => {
    return (
        <div>
            <AddForm db={db} />
        </div>
    );
};

export default Container;
