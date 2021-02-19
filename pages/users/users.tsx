import React, { useState } from 'react';
import axios, { AxiosInstance } from 'axios';
import AddUser, { AddUserProps } from './addUser';
import UserList, { UserListProps } from './userList';
import DeleteUser, { DeleteUserProps } from './deleteUser';
import styles from './userList.module.css';

const instance:AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/user/',
});

interface User {
    id: number;
    name: string;
    email: string;
};

interface userProps {
    users: User[];
}

const Users = ((props: userProps):JSX.Element => {
    const [addingUser, setAddingUser] = useState(false);
    const [deletingUser, setDeletingUser] = useState(false);
    const [users, setUsers] = useState(props.users);
    const [selectedUser, setSelectedUser] = useState(null as User);
    const [cards, setCards] = useState([] as JSX.Element[]);

    var addUserProps: AddUserProps = {
        instance: instance,
        addingUser: addingUser,
        setAddingUser: setAddingUser,
        users: users,
        setUsers: setUsers
    };
    var userListProps: UserListProps = {
        addingUser: addingUser,
        setAddingUser: setAddingUser,
        setDeletingUser: setDeletingUser,
        setSelectedUser: setSelectedUser,
        users: users
    };
    var deleteUserProps: DeleteUserProps = {
        deletingUser: deletingUser,
        instance: instance,
        selectedUser: selectedUser,
        setDeletingUser: setDeletingUser,
        setUsers: setUsers,
        users: users
    };
    cards.push(UserList(userListProps));

    const generateRows = (() => {
        return cards.map((card: JSX.Element, i: number) => {
            return <div id={`card${i}`}>{card}</div>;
        });
    });
    return <div id="all" className={styles.flexContainer}>
        {generateRows()}
    </div>;
});

const getServerSideProps = (async () => {
    console.log("Running getServerSideProps");
    var users: User[] = [];
    await instance.get('getAll')
        .then(((response) => {
            response.data.forEach((entity) => {
                users.push(entity as User)
            });
        }))
        .catch(((error) => {
            console.log(error);
        }));
    return { props: {users: users }};
});

export { instance, getServerSideProps };
export type { User };
export default Users;