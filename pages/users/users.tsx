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

const Users = ((props: userProps) => {
    const [addingUser, setAddingUser] = useState(false);
    const [deletingUser, setDeletingUser] = useState(false);
    const [users, setUsers] = useState(props.users);
    const [selectedUser, setSelectedUser] = useState(null as User);

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
    return <div id="all" className={styles.flexContainer}>
        {UserList(userListProps)}
        {AddUser(addUserProps)}
        {DeleteUser(deleteUserProps)}
    </div>
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

export { instance };
export type { User };
export { getServerSideProps };
export default Users;