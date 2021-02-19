import React, { useState } from 'react';
import styles from './userList.module.css';
import { User } from './users';

interface UserListProps {
    users: User[];
    setSelectedUser: React.Dispatch<React.SetStateAction<User>>;
    setDeletingUser: React.Dispatch<React.SetStateAction<boolean>>;
    setAddingUser: React.Dispatch<React.SetStateAction<boolean>>;
    addingUser: boolean;
}

const UserList = ((props: UserListProps) => {
    const generateRows = (() => {
        var rows = props.users.map((user: User) => {
            var key = `editField${user.id}`;
            return <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                    <div>
                        <button onClick={((e) => { props.setSelectedUser(user); props.setDeletingUser(true) })} >Delete</button>
                    </div>
                    <div id={key} />
                </td>
            </tr>;
        });
        return rows;
    });

    return <div id="list" className={styles.flexContainerFirstChild}>
        <h3>All Users</h3>
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
            <button onClick={(() => { props.setAddingUser(true) })} disabled={props.addingUser}>Add</button>
        </div>
    </div>
});




export default UserList;
export type { UserListProps };