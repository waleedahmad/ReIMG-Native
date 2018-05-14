import React from 'react';
import {KeyboardAvoidingView, Image, StyleSheet, Alert} from 'react-native';
import { Input, Button} from 'react-native-elements';

class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            text: ''
        };
    }

    static navigationOptions = {
        header : null
    };

    searchReddit(e){
        if(this.state.text.length){
            this.props.navigation.navigate('Results', {
                subreddit: this.state.text,
            });
        }else{
            Alert.alert(
                'Invalid Input',
                'Please enter a valid Reddit',
                [
                    {text: 'OK'}
                ]
            )
        }
    }

    render() {
        return (
            <KeyboardAvoidingView
                style={styles.view}
                behavior="padding"
            >

                <Image
                    source={require('../res/reddit.png')}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 100,
                        height: 100,
                    }}
                />

                <Input
                    inputContainerStyle={styles.search}
                    containerStyle={styles.container}
                    inputStyle={styles.input}
                    onChangeText={(text) => this.setState({text})}
                    placeholder='Search your favorite Subreddit'
                />

                <Button
                    title='Search'
                    buttonStyle={styles.button}
                    onPress={this.searchReddit.bind(this)}
                />

            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    view : {
        flex: 1,
        justifyContent: 'center',
        alignContent:'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
    search: {
        borderWidth : 1,
        borderRadius : 25,
        borderColor : '#ed3904',
    },
    container : {
        marginTop: 20,
        marginBottom : 20
    },
    input : {
        textAlign:'center'
    },
    button : {
        backgroundColor : '#ed3904',
        width: 100
    },
});


export default Search;