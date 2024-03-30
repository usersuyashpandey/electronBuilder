import * as React from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';

export default function CustomCard({ userData }) {
    return (
        <Box sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2, margin: '10px', overflow: 'hidden' }}>
            <Card variant="outlined">
                <CardMedia
                    component="img"
                    height="140"
                    image={userData.imageUrl}
                    alt={userData.name}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        {userData.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Email: {userData.email}
                    </Typography>
                    <Typography variant="body2">
                        Address: {userData.address}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" href='' target="_blank">Learn More</Button>
                </CardActions>
            </Card>
        </Box>
    );
}
