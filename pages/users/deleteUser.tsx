import { AxiosInstance } from "axios";
import { User } from "./users";
import styles from './userList.module.css';

interface DeletePayload {
    id: number;
}

interface DeleteUserProps {
    instance: AxiosInstance;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setDeletingUser: React.Dispatch<React.SetStateAction<boolean>>;
    deletingUser: boolean;
    selectedUser: User
}

const DeleteUser = ((props: DeleteUserProps):JSX.Element => {
    const onDelete = (async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        const payload: DeletePayload = { id: id };
        console.log(`Calling delete with id ${payload.id}`);
        await props.instance.post('/deleteUserById', payload)
            .then(((response) => { // success, refresh the list of users
                props.setUsers(props.users.filter((user: User) => {
                    return (user.id !== id);
                }));
                console.log(`Deleted ${id}`)
            }))
            .catch(((error) => {
                console.log(error);
            }))
            .finally(() => {
                props.setDeletingUser(false);
            });
    });

    return props.deletingUser && <div className={styles.flexContainerSubsequentChild}>
        <h3>Delete User</h3>
        <p>Are you sure you want to delete {props.selectedUser.name}?</p>
        <div>
            <button onClick={((e) => { onDelete(e, props.selectedUser.id) })}>Delete</button>
            <button onClick={(() => { props.setDeletingUser(false) })}>Cancel</button>
        </div>
    </div>
});

export default DeleteUser;
export type { DeleteUserProps };