import React from 'react';
import axios from 'axios';

interface User {
    name: string;
    email: string;
}
interface SkaterListProps {
    skaters: User[];    
}

const SkaterList = ((props: SkaterListProps) => {
    const generateRows = ((skaters: User[]) => {
        var rows = skaters.map((skater:User) => {
            return <tr key={skater.email}><td>{skater.name}</td><td>{skater.email}</td></tr>;
        });
        return rows;
    });

    return <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            {generateRows(props.skaters)}
        </tbody>
    </table>
});

const instance = axios.create({
    baseURL: 'http://localhost:8080/user/'
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