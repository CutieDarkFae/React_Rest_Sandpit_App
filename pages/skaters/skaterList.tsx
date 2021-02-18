import React, { useState } from 'react';
import axios from 'axios';
import CSS from 'csstype';
import styles from './skaterList.module.css';

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
    const [addingSkater, setAddingSkater] = useState(false);
    const [deletingSkaters, setDeletingSkater] = useState(false);
    const [skaters, setSkaters] = useState(props.skaters);
    const [selectedSkater, setSelectedSkater] = useState(null as User);
    
    const deleteSkater = (() => {
        const onDelete = (async(e: React.MouseEvent, id: number) => {
            e.preventDefault();
            const payload: DeletePayload = {id: id};
            console.log(`Calling delete with id ${payload.id}`);
            await instance.post('/deleteUserById', payload)
            .then(((response) => { // success, refresh the list of skaters
                setSkaters(skaters.filter((user: User) => {
                    return (user.id !== id);
                }));
                console.log(`Deleted ${id}`)
            }))
            .catch(((error) => {
                console.log(error);
            }))
            .finally(() => {
                setDeletingSkater(false);
            });
        });

        return deletingSkaters && <div className={styles.flexContainerSubsequentChild}>
            <h3>Delete Skater</h3>
            <p>Are you sure you want to delete {selectedSkater.name}?</p>
            <div>
                <button onClick={((e) => {onDelete(e, selectedSkater.id)})}>Delete</button>
                <button onClick={(() => {setDeletingSkater(false)})}>Cancel</button>
            </div>
        </div>
    });

    // const onEdit = (async(e: React.MouseEvent, id: number) => {
    //     e.preventDefault();
    //     const idDTO: DeletePayload = {id: id} as DeletePayload;
    //     const updateDTO: User = {id: null, name: }
    // });
  
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
            .finally(() => {
                setAddingSkater(false);
            })
        });
        return addingSkater && <div id="add" className={styles.flexContainerSubsequentChild}>
            <form onSubmit={(e) => {
                onAdd(e, {name: name, email: email} as AddPayload);
            }}>
                <h3>Add Skater</h3>
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
        </div>;
    });
    
    const generateRows = (() => {
        var rows = skaters.map((skater:User) => {
            var key = `editField${skater.id}`;
            return <tr key={skater.id}>
                <td>{skater.name}</td>
                <td>{skater.email}</td>
                <td>
                    <div>
                        <button onClick={((e) => {setSelectedSkater(skater); setDeletingSkater(true)})} >Delete</button>
                    </div>
                    <div id={key} />
                </td>
            </tr>;
        });
        return rows;
    });

    return <div id="all" className={styles.flexContainer}>
        <div id="list" className={styles.flexContainerFirstChild}>
        <h3>All Skaters</h3>
            <table>
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
            <div>
                <button onClick={(() => {setAddingSkater(true)})} disabled={addingSkater}>Add</button>
            </div>
        </div>
        {addSkater()}
        {deleteSkater()}

    </div>
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