import React, { useState } from "react";
import { Datum } from "./Container";

type Props = {
    db: firebase.firestore.Firestore;
    setUpdate: (b: boolean) => void;
};

const AddForm: React.FunctionComponent<Props> = (props: Props) => {
    const numbersRegex = /^[0-9]*$/;
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [message, setMessage] = useState("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setMessage("");
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (numbersRegex.test(e.target.value)) {
            setPrice(e.target.value);
            setMessage("");
        } else {
            setMessage("You must enter an integer");
        }
    };

    const handleSubmit = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (name && price) {
            const datumToBeAdded: Datum = {
                name,
                price: parseInt(price)
            };
            props.db.collection("expenses").add(datumToBeAdded);
            props.setUpdate(false);
            setName("");
            setPrice("");
        } else {
            setMessage("You must set both a name and a price");
        }
    };
    return (
        <div>
            <form>
                {message ? <div>{message}</div> : <br />}
                <input value={name} onChange={handleNameChange} />
                <br />
                <input value={price || ""} onChange={handlePriceChange} />
                <br />
                <button type="submit" onClick={handleSubmit}>
                    Add
                </button>
            </form>
        </div>
    );
};

export default AddForm;
