import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ListRenderItemInfo,
  
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
//import LogoRoad from "./icons/logo";
import { ImageOverlay } from "./extra/image-overlay.component";
import { CategoryList } from "./extra/category-list.component";
import { HeartIcon, MessageCircleIcon } from "./extra/icons";
//import firestore from '@react-native-firebase/firestore';
import {
  Divider,
  Card,
  ViewPager,
  Layout,
  Icon,
  Button,
  Modal,
  Avatar,
  Text,
  List,
} from "@ui-kitten/components";


//export default function App(navigation) {
export default function App() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  let onEndReachedCalledDuringMomentum = false;

  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [IRoad, setIRoad] = useState([]);

  const  IRoadRef = firebase.firestore().collection("Evdrel");

  useEffect(() => {
    getIRoad();
  }, []);

  getIRoad = async () => {
    setIsLoading(true);

    const snapshot = await IRoadRef.orderBy("date", "desc").limit(4).get();

    if (!snapshot.empty) {
      let newIRoad = [];

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      for (let i = 0; i < snapshot.docs.length; i++) {
        newIRoad.push(snapshot.docs[i].data());
      }

      setIRoad(newIRoad);
    } else {
      setLastDoc(null);
    }

    setIsLoading(false);
  };

  getMore = async () => {
    if (lastDoc) {
      setIsMoreLoading(true);

      setTimeout(async () => {
        let snapshot = await IRoadRef.orderBy("date", "desc")
          .startAfter(lastDoc.data().date)
          .limit(5)
          .get();

        if (!snapshot.empty) {
          let newIRoad = IRoad;

          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

          for (let i = 0; i < snapshot.docs.length; i++) {
            newIRoad.push(snapshot.docs[i].data());
          }

          setIRoad(newIRoad);
          if (snapshot.docs.length < 3) setLastDoc(null);
        } else {
          setLastDoc(null);
        }

        setIsMoreLoading(false);
      }, 1000);
      console.log("shine");
    }

    onEndReachedCalledDuringMomentum = true;
  };

  renderList = ({ text, photo, email, uid, cat, date, isNew, complete }) => {
    return (
      <Card style={styles.item} status='warning'>
        <ImageOverlay style={styles.itemImage} source={{ uri: photo }}>
          <Text
            style={styles.itemTitle}
            category="h6"
            status="control"
            numberOfLines={1}
          >
            {text} 
          </Text>
          
          <Text style={styles.itemDescription} category="s1" status="control">
            {cat} {complete ? (
                            <Text category='label' style={styles.text} status='success' >Шийдэгдсэн</Text>
                          ) : (
                            <Text category='label' style={styles.text} status='info' >Шийдэгдээгүй</Text>
                          )}
          </Text>
          <View style={styles.itemFooter}>
          
            <Icon
              style={styles.iconCard}
              fill="white"
              name="calendar-outline"
            />
            <Text style={styles.itemDescription} category="s1" status="control">
              {new Date(date.seconds * 1000).toLocaleDateString("en-US")}
            </Text>
            <Icon style={styles.iconCard} fill="white" name="people-outline" />
            <Text style={styles.itemDescription} category="s1" status="control">
              {email}
            </Text>
          </View>
        </ImageOverlay>
      </Card>
    );
  };

  onRefresh = () => {
    setTimeout(() => {
      getIRoad();
    }, 1000);
  };

  renderFooter = () => {
    if (!isMoreLoading) return true;

    return (
      <View>
        <Text style={{ margin: 10, textAlign: "center" }}>
          Мэдээлэл хайж байна
        </Text>
        <ActivityIndicator
          size="large"
          color={"orange"}
          style={{ marginBottom: 10 }}
        />
      </View>
    );
  };

  return (
    <FlatList
          data={IRoad}
          style={{ flex: 1, marginHorizontal:10}}
          //keyExtractor={(item) => item.id}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          renderItem={({ item }) => renderList(item)}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
          initialNumToRender={3}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum && !isMoreLoading) {
              getMore();
            }
          }}
        />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item: {
    marginVertical: 8,
    height: 220,
    
  },
  itemImage: {
    ...StyleSheet.absoluteFillObject,
    height: 220,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  itemTitle: {
    zIndex: 1,
  },
  itemDescription: {
    zIndex: 1,
    marginVertical: 16,
  },
  itemFooter: {
    position: "absolute",
    flexDirection: "row",
    left: 8,
    bottom: 8,
  },
  iconButton: {
    paddingHorizontal: 0,
  },

  title: {
    fontWeight: "300",
    fontSize: 26,
    marginVertical: 10,
    marginLeft: 10,
    color: "#333333",
  },
  icon: {
    width: 32,
    height: 32,
  },
  iconCard: {
    width: 25,
    height: 25,
    margin: 10,
  },
  postsList: {
    paddingHorizontal: 8,
  },
  tab: {
    justifyContent: "center",
  },
  text: {
    margin: 4,
  },
});
