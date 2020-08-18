import React from 'react';
import { Grid } from 'gridjs-react';
import './custom-mermaid.css';

export interface TradesPageProps {

}

const TradesPage: React.SFC<TradesPageProps> = () => {
    return (
        <Grid
            data={[
                ['John', 'john@example.com'],
                ['Mike', 'mike@gmail.com']
            ]}
            columns={['Name', 'Email']}
            search={true}
            pagination={{
                enabled: true,
                limit: 1,
            }}
        />
    );
}

export default TradesPage;