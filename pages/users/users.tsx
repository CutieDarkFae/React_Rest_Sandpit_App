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

interface Card {
    name: string;
    instance: number;
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
    if (cards.length === 0) { cards.push(UserList(userListProps)); }

    const generateRows = (() => {
        return cards.map((card: JSX.Element, i: number) => {
            return <div id={`card${i}`}>{card}</div>;
        });
    });

    const addUser = (() => {
        var addUserProps: AddUserProps = {
            instance: instance,
            addingUser: addingUser,
            setAddingUser: setAddingUser,
            users: users,
            setUsers: setUsers,
            card: { instance: cards.length + 1, // +1 because we're about to add this to cards
                name: "Add"
            } as Card,
            cards: cards,
            setCards: setCards
        };
        cards.push(AddUser(addUserProps)); // how to close the screen? how to save the user?  These will need to be pushed down
        // or we allow AddUser to know what it needs to do, and just feed it the data
        // how to get a card to know it's a card so it can remove itself from the list of cards?  currently cards is just JSX.Element[]  If I change it, will things still render?
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
export type { User, Card };
export default Users;