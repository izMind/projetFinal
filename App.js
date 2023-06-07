import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, Button, FlatList, Alert, Pressable,TouchableOpacity} from 'react-native';
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
  translate.locale= traduction; 
  //fin translate

  const [data, setData] = useState([]);              //Json
  const [idx, setIdx] = useState(-1);                 //index de donné trouvé par Id, Le utilisateur ne le choisisse pas forcément
  const [idxSelected, setIdxSelected] = useState(0); //Index choisi
  const [texte, setTexte] = useState("00");          //Pour initializer TexteInput d'Id
  const [session, setSession] = useState("");        //Pour Afficher information de session
  const [nouCours, setNouCours] = useState([]);      //Pour savoir le nom de nouvelle cours
  const [info, setInfo] = useState(translate.t("noStudent"));
  const [msg, setMsg] = useState(translate.t("confirmStudent"));
  const [darkmode, setDarkmode] = useState(true);

  //Couleurs
  let colorBlackBlue= darkmode?"black":"cornflowerblue";
  let colorHeader= darkmode?"black":"blue";
  let colorGreyWhite= darkmode?"#878889":"mintcream";
  let colorGreySky= darkmode?"#A3A9A9":"turquoise";
  let colorWhiteBlack= darkmode?"white":"black";



  


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
      setIdx(-1);
      setIdxSelected(0);
      setInfo(data[0].nom);
    }
  };

  const addCours = (cours) => {
      setNouCours(cours);
  };

  const register = () => {
    let allCours="";
    if (nouCours.length && data[idxSelected].cours.length < 5) {
      if (data[idxSelected]?.cours.indexOf(nouCours) == -1) {
        allCours = [...data[idxSelected].cours,nouCours];
      }
    }

      if (Number(session)) {
        if (allCours.length) {
          data[idxSelected] = {...data[idxSelected], cours:allCours, session:session};
        } else {
          data[idxSelected] = {...data[idxSelected], session:session};
        }
      } else {
        //Si session n'est pas numéro, l'ignorer
        if (allCours.length) {
          data[idxSelected] = {...data[idxSelected], cours:allCours};
        } 
      }
    setNouCours("");
  }

  const afficher = () => {
    //console.log(1);
    let msg = `${data[idxSelected].nom}, id ${data[idxSelected].id_etudiant}, ${translate.t("semester")} ${data[idxSelected].session}, ${translate.t("studentClass")}\n`;
    
    for (let i = 0; i < data[idxSelected].cours.length; i++) {
      if (i == (data[idxSelected].cours.length - 1))
        msg += `    ${data[idxSelected].cours[i]}`
      else
        msg += `    ${data[idxSelected].cours[i]},\n`
    }
    //console.log(12);console.log(msg);
    Alert.alert('Soumis',msg);
    //console.log(123);
  }
    const modifierLangue = ()=>{
    if(traduction==="fr"){
      setTraduction("en") 
    }else{
      setTraduction("fr") 
    }
  }
      const modifierStyle = ()=>{
    if(darkmode){
      setDarkmode(false) 
    }else{
      setDarkmode(true) 
    }
  }

  return (
    <View style={[styles.container,{backgroundColor:colorGreyWhite}]}>
      <Header titre = {translate.t("headText")} couleurFond = {colorHeader}/>
    
      <View style={[styles.select,{backgroundColor:colorGreySky}]}>
        <TouchableOpacity
        activeOpacity={0.2}
        onPress={modifierLangue}>
        <Text style = {[styles.toText, styles.button3,{backgroundColor:colorBlackBlue}]}>{translate.t("lang")}</Text>
      </TouchableOpacity> 
       <TouchableOpacity
        activeOpacity={0.2}
        onPress={modifierStyle}>
        <Text style = {[styles.toText, styles.button3,{backgroundColor:colorBlackBlue}]}>Dark</Text>
      </TouchableOpacity> 
      <Text style={styles.font}>Id:</Text>
        <TextInput style={{borderWidth:1}} keyboardType="number-pad" onChangeText={idToName} value={texte} />
        <Text style={styles.font}>{info}</Text>
        <Pressable   style={[styles.press,{backgroundColor:colorBlackBlue}]}
          onPress={()=>{if (idx>0) {setMsg(translate.t("studentSelected"));setIdxSelected(idx);}}}>
          <Text style={styles.pressText}>{translate.t("selectStudent")}</Text>
        </Pressable>
        <Text style={[styles.font, {color:'red'}]}>{msg}</Text>
      </View>

      <View style={styles.cours}>
        <Text style={[styles.font,{color:colorWhiteBlack}]} >{translate.t("semester")}</Text>
        <TextInput style={{borderWidth:1, width:'98%'}} keyboardType="number-pad" onChangeText={setSession} value={session} />
        <Text style={[styles.font,{color:colorWhiteBlack}]}>{translate.t("registerStudent")}</Text>
        <TextInput style={{borderWidth:1, width:'98%'}} onChangeText={addCours} value={nouCours} />
      </View>

      <View style={styles.buttonView}>
        <Pressable   style={[styles.press,{backgroundColor:colorBlackBlue}]}
          onPress={register}>
          <Text  style={styles.pressText}>{translate.t("register")}</Text>
        </Pressable>
      </View>
      <View style={styles.buttonView}>
        <Pressable   style={[styles.press,{backgroundColor:colorBlackBlue}]}
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
    padding: 8,
  },
  select:{
    justifyContent:'space-around',
    backgroundColor:'#A3A9A9',
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
    backgroundColor:'black',
  },
  pressText:{
    color:'white',
    textAlign:'center'
  },
  buttonView:{
    marginTop:20
  },
  font:{
    color:'white',
    fontWeight: 'bold'
  },
    toText:{
    fontSize:25,
    textAlign: "center",
    borderWidth: "20%",
    borderRadius: 4,
  },
    button3:{
    alignSelf: 'flex-end',
    backgroundColor: 'black',
    color: 'white',
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom:8,
  },
});
