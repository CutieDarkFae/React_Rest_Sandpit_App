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

const instance = axios.create({
    baseURL: 'http://localhost:8080/user/',
});

const SkaterList = ((props: SkaterListProps) => {
    var users = props.skaters;
    const onDelete = (async(id: number) => {
        const payload: DeletePayload = {id: id};
        console.log(`Calling delete with id ${payload.id}`);
        await instance.post('/delete', payload)
        .then(((response) => { // success, refresh the list of skaters
            users = users.filter((user: User) => {
                return (user.id !== id);
            });
            console.log(`Deleted ${id}`)
        }))
        .catch(((error) => {
            console.log(error);
        }));
    });
    const generateRows = ((skaters: User[]) => {
        var rows = skaters.map((skater:User) => {
            return <tr key={skater.id}>
                <td>{skater.name}</td>
                <td>{skater.email}</td>
                <td><button onClick={(() => {onDelete(skater.id)})} >Delete</button></td>
            </tr>;
        });
        return rows;
    });

    return <><table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            {generateRows(users)}
        </tbody>
    </table>
    <div>{addSkater()}</div>
    </>
});

interface AddPayload {
    name: string;
    email: string;
}

const addSkater = (() => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const onAdd = (async(payload: AddPayload) => {
        await instance.post('/addUser', {payload})
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })
    });
    return <>
        <form onSubmit={() => {
            onAdd({name: name, email: email} as AddPayload);
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