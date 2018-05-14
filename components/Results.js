import React from "react";
import {ScrollView, View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {Button} from 'react-native-elements';
import axios from 'react-native-axios';
import FlexImage from 'react-native-flex-image';
import url from 'url';
import NotFound from "./NotFound";



class Results extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            subreddit : props.navigation.getParam('subreddit', 'Not Provided'),
            req_params : '',
            images : [],
            loading : false,
            not_found : false,
            nextPage : false,
        };
        this._mounted = false;
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
            title: params ? '/r/'+params.subreddit : 'Results'
        }
    };

    componentDidMount(){
        this.getImages();
        this._mounted = true;
        this.setState({
            loading: true,
        })
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    getPathName(href) {
        let _url = url.parse(href);
        return _url.pathname;
    };

    isImage(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) !== null);
    }

    stripAlbumID(url) {
        let path = this.getPathName(url),
            ids = path.split('/').filter(part => part !== "");
        return ids[ids.length - 1];
    }

    stripAlbumType(url) {
        if(url.indexOf('/a/') !== -1){
            return 'album';
        }else if(url.indexOf('/gallery/') !== -1){
            return 'gallery';
        }else{
            return 'image';
        }
    }

    getImages(){
        let images = [],
            albums = [];

        axios.get('https://www.reddit.com/r/'+ this.state.subreddit + '.json'+ this.state.req_params)
            .then(function (response) {
                let after = response.data.data.after;
                this.setState({
                    req_params : after.length ? '?after=' + after : '',
                    nextPage : !!after.length

                });
                response.data.data.children.map(function(item, i){
                    if (item.kind === 't3') {
                        if (this.isImage(item.data.url)) {
                            images = images.concat({
                                url : item.data.url,
                                id : item.data.id,
                                title : item.data.title
                            })
                        } else {
                            if (item.data.domain === 'imgur.com') {
                                let albumID = this.stripAlbumID(item.data.url),
                                    type = this.stripAlbumType(item.data.url),
                                    APIUrl = "https://api.imgur.com/3/"+type+"/" + albumID + "/images";
                                albums = albums.concat({
                                    title : item.data.title,
                                    url : APIUrl,
                                    id : albumID
                                })
                            }
                        }
                    }
                }.bind(this))


                const url_promises = albums.map(album => {
                    return axios.get(album.url , { headers: {"Authorization" : 'Client-ID fc6952f445a03f3'} })
                });

                axios.all(url_promises).then(function(results) {
                    results.map(r => {
                        let _album = albums.filter(function( album ) {
                            return album.url === r.config.url;
                        })[0];

                        if(r.data.data.length){
                            r.data.data.map(function(res, i){
                                images = images.concat({
                                    title : _album.title,
                                    url : res.link,
                                    id : _album.id
                                })
                            })
                        }else{
                            images = images.concat({
                                url : r.data.data.link,
                                id : _album.id,
                                title : _album.title
                            });
                        }
                    });

                    if(this._mounted){
                        this.setState({
                            images : this.state.images.concat(images)
                        }, () => {
                            this.setState({
                                loading : false
                            })
                        })
                    }
                }.bind(this));

            }.bind(this))
            .catch(function (error) {
                this.setState({
                    not_found : true,
                    loading : false
                })
            }.bind(this));
    }

    loadMore(e){
        if(!this.state.loading){
            this.setState({
                loading : true
            },() => {
                this.getImages();
            });
        }
    }

    render() {
        return (
            <ScrollView>
                {this.state.images.map(function(image, index){
                    return (
                        <View key={index} style={{
                            margin : 10
                        }}>
                            <Text style={{
                                marginBottom : 10,
                                fontSize : 20,
                            }}>{image.title}</Text>

                            <FlexImage
                                source={{
                                    uri: image.url,
                                    cache: 'force-cache'
                                }}
                                loadingComponent={
                                    <ActivityIndicator size='large' color="#ed3904" />
                                }
                            />
                        </View>
                    )
                })}

                {this.state.loading && (
                    <ActivityIndicator size="large" color="#ed3904" style={styles.loading} />
                )}

                {this.state.nextPage && (
                    <Button
                        title='Load More'
                        buttonStyle={styles.button}
                        onPress={this.loadMore.bind(this)}
                    />
                )}

                {this.state.not_found && (
                    <NotFound subreddit={this.state.subreddit}/>
                )}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    button : {
        backgroundColor : '#ed3904',
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft : 'auto',
        marginRight : 'auto',
        marginTop : 20,
        marginBottom : 20
    },
    loading : {
        marginTop: 50
    }
});

export default Results;