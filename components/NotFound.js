import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';

class NotFound extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <View>
                <Image
                    source={require('../res/reddit.png')}
                    style={styles.image}
                />
                <Text style={styles.message}>Subreddit {this.props.subreddit} not found</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image : {
        height: 100,
        width: 100,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 50,
        marginBottom: 30
    },
    message : {
        textAlign : 'center',
        fontSize : 20
    }
});


export default NotFound;