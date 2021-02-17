import React, { useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
}
interface SkaterListProps {
    skaters: User[];    
}

interface DeletePayload {
    id: number;
}

interface AddPayload {
    name: string;
    email: string;
}

const instance = axios.create({
    baseURL: 'http://localhost:8080/user/',
});

const SkaterList = ((props: SkaterListProps) => {
    const [skaters, setSkaters] = useState(props.skaters);

    const onDelete = (async(id: number) => {
        const payload: DeletePayload = {id: id};
        console.log(`Calling delete with id ${payload.id}`);
        await instance.post('/delete', payload)
        .then(((response) => { // success, refresh the list of skaters
            setSkaters(skaters.filter((user: User) => {
                return (user.id !== id);
            }));
            console.log(`Deleted ${id}`)
        }))
        .catch(((error) => {
            console.log(error);
        }));
    });
    const generateRows = (() => {
        var rows = skaters.map((skater:User) => {
            return <tr key={skater.id}>
                <td>{skater.name}</td>
                <td>{skater.email}</td>
                <td><button onClick={(() => {onDelete(skater.id)})} >Delete</button></td>
            </tr>;
        });
        return rows;
    });

    const addSkater = (() => {
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const onAdd = (async(e: React.FormEvent, payload: AddPayload) => {
            e.preventDefault();
            console.log(`Adding user with payload ${payload}`);
            await instance.post('/addUser', payload)
            .then((response) => {
                console.log(response);
                setSkaters([...skaters, response.data as User]);
                setName("");
                setEmail("");
            })
            .catch((error) => {
                console.log(error);
            })
        });
        return <>
            <form onSubmit={(e) => {
                onAdd(e, {name: name, email: email} as AddPayload);
            }}>
                <label>
                    Name :
                    <input type="text" value={name} onChange={((e) => {setName(e.target.value)})} />
                </label>
                <label>
                    Email:
                    <input type="text" value={email} onChange={((e) => {setEmail(e.target.value)})} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </>;
    });

    return <><table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            {generateRows()}
        </tbody>
    </table>
    <div>{addSkater()}</div>
    </>
});



const getServerSideProps = (async () => {
    console.log("Running getServerSideProps");
    var skaters: User[] = [];
    await instance.get('getAll')
        .then(((response) => {
            response.data.forEach((entity) => {
                skaters.push(entity as User)
            });
        }))
        .catch(((error) => {
            console.log(error);
        }));
    return { props: {skaters: skaters }};
});

export default SkaterList;
export { getServerSideProps };