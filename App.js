import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, Button, FlatList, Alert, Pressable} from 'react-native';
import Constants from 'expo-constants';
import Header from './Header';
import * as Localization from 'expo-localization';
import {I18n} from 'i18n-js';
import trad from './traduction';

export default function App() {
  //Translate
  const [traduction, setTraduction]= React.useState("fr");
  const translate = new I18n(trad);
  translate.enableFallback = true;
  translate.defaultLocale = "fr";
  translate.locale = Localization.locale;
  
  //fin translate

  const [data, setData] = useState([]);              //Json
  const [idx, setIdx] = useState(0);                 //index de donné trouvé par Id, Le utilisateur ne le choisisse pas forcément
  const [idxSelected, setIdxSelected] = useState(0); //Index choisi
  const [texte, setTexte] = useState("00");          //Pour initializer TexteInput d'Id
  const [session, setSession] = useState("");        //Pour Afficher information de session
  const [nouCours, setNouCours] = useState([]);      //Pour savoir le nom de nouvelle cours
  const [info, setInfo] = useState(translate.t("noStudent"));
  const [msg, setMsg] = useState(translate.t("confirmStudent"));
  


 //Prend les students et le met dans le DATA
 const getStudents = () => {
  fetch("https://raw.githubusercontent.com/izMind/JSONFINAL/main/etudiants%2Cjson").then(res => res.json())
    .then(json => {setData(json.etudiants)})
    .catch (error => {console.log(`Erreur ${error}`)})
  };

  useEffect(() => {
    getStudents();
  }, []);

  //Trouver l'index de donné
  //Il n'est pas en ordre nécessairement, donc on ne peut pas utiliser id comme index
  const idToName = (id) => {
    setMsg(translate.t("confirmStudent"));
    setTexte(id);
    let idx = data.findIndex(it=>it.id_etudiant == id);
    if (idx > -1) {
      setIdx(idx);
      setInfo(data[idx].nom);
      setSession(data[idx].session);
    } else {
      setInfo(data[0].nom);
    }
  };

  const addCours = (cours) => {
    if (cours.length)
      setNouCours(cours);
  };
  
  const register = () => {
    if (nouCours.length && data[idxSelected].cours.length < 5) {
      if (data[idxSelected]?.cours.indexOf(nouCours) == -1) {
        let allCours = [...data[idxSelected].cours,nouCours];
        //console.log(allCours);
        data[idxSelected] = {...data[idxSelected], cours:allCours};
      }
    }
    setNouCours("");
    
  }

  const afficher = () => {
    let msg = `${translate.t("submit")}\n${data[idxSelected].nom}, id ${data[idxSelected].id_etudiant}, ${translate.t("semester")} ${session}, ${translate.t("studentClass")}\n`;
    for (let i = 0; i < data[idxSelected].cours.length; i++) {
      if (i == (data[idxSelected].cours.length - 1))
        msg += `${data[idxSelected].cours[i]}`
      else
        msg += `${data[idxSelected].cours[i]},\n`
    }
    alert(msg);
  }
  
  return (
    <View style={styles.container}>
      <Header titre = {translate.t("headText")} couleurFond = "blue"/>

      <View style={styles.select}>
        <Text style={styles.font}>Id:</Text>
        <TextInput style={{borderWidth:1}} keyboardType="number-pad" onChangeText={idToName} value={texte} />
        <Text style={styles.font}>{info}</Text>
        <Pressable   style={styles.press}
          onPress={()=>{setMsg(translate.t("studentSelected"));setIdxSelected(idx);}}>
          <Text style={styles.pressText}>{translate.t("selectStudent")}</Text>
        </Pressable>
        <Text style={[styles.font, {color:'red'}]}>{msg}</Text>
      </View>

      <View style={styles.cours}>
        <Text style={styles.font} >{translate.t("semester")}</Text>
        <TextInput style={{borderWidth:1, width:'98%'}} onChangeText={setSession} value={session} />
        <Text style={styles.font}>{translate.t("registerStudent")}</Text>
        <TextInput style={{borderWidth:1, width:'98%'}} onChangeText={addCours} value={nouCours} />
      </View>

      <View style={styles.buttonView}>
        <Pressable   style={styles.press}
          onPress={register}>
          <Text  style={styles.pressText}>{translate.t("register")}</Text>
        </Pressable>
      </View>
      <View style={styles.buttonView}>
        <Pressable   style={styles.press}
          onPress={afficher}>
          <Text style={styles.pressText}>{translate.t("display")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  select:{
    justifyContent:'space-around',
    backgroundColor:'lightgreen',
    height:210,
    padding: 20,
    fontSize: 18
  },
  cours:{
    justifyContent:'space-around',
    height:130,
    fontSize: 18,
    marginTop:10, 
    marginBottom:40
  },
  press: {
    padding:8,
    borderRadius:3,
    backgroundColor:'dodgerblue',
  },
  pressText:{
    color:'white',
    textAlign:'center'
  },
  buttonView:{
    marginTop:20
  },
  font:{
    fontWeight: 'bold'
  },
});
