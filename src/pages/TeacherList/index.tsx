import React, { useState, useEffect } from 'react'
import { View,Text, TextInput } from 'react-native';
import {Feather} from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { ScrollView, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import styles from './styles'
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList(){
    const [favorites, setFavorites] = useState<number[]>([]);
    const [teachers, setTeachers]= useState([]);
    const [isFiltersVisible, setIsFilterVisible]= useState(false);   

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response =>{
            if(response){

                const favoriteTeachers= JSON.parse(response);
                const favoriteTeachersId= favoriteTeachers.map((teacher: Teacher) =>{
                    return teacher.id
                })
                setFavorites(favoriteTeachersId);
            }
        });
    }

    useFocusEffect(()=>{
        loadFavorites();
    })

    function handleToogleFilterVisible(){
        setIsFilterVisible(!isFiltersVisible);
    }

  async function handleFilterSbumit(){
       loadFavorites();
       const response = await api.get('classes',{
       params:{
        subject,
        week_day,
        time
       } 
       })
       setIsFilterVisible(false);
       setTeachers(response.data);
    }
    return (
        <View style={styles.container}>
        <PageHeader title="Proffys disponíveis" 
        headerRight={(
            <BorderlessButton onPress={handleToogleFilterVisible}>
                <Feather name="filter" size={20} color="#FFF"></Feather>
            </BorderlessButton>
        )}
        
        >{ isFiltersVisible && (<View style={styles.searchForm}> 
            <Text style={styles.label}>Matéria</Text>
            <TextInput style={styles.input}
              value={subject}
              onChangeText={text => setSubject(text)}
            placeholder="Qual a matéria?"
            placeholderTextColor="#c1bccc"
            />
            <View style={styles.inputGroup}>
                <View style={styles.inputBlock}>
                    <Text style={styles.label}>Dia da Semana</Text>
                     <TextInput style={styles.input}
                     value={week_day}
                     onChangeText={text => setWeekDay(text)}
                     placeholder="Qual o dia?"
                     placeholderTextColor="#c1bccc"
                     ></TextInput>
                </View>
                <View style={styles.inputBlock}>
                    <Text style={styles.label}>Horário</Text>
                     <TextInput style={styles.input}
                     value={time}
                     onChangeText={text => setTime(text)}
                     placeholder="Qual o horário?"
                     placeholderTextColor="#c1bccc"
                     ></TextInput>
                </View>
             </View>
             <RectButton onPress={handleFilterSbumit} style={styles.submitButton}>
                 <Text style={styles.submitButtonText}>Filtrar</Text>
             </RectButton>
        </View> 
    )}

    </PageHeader>

        <ScrollView style={styles.teacherList}
        contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 16
        }}
        >
        {teachers.map((teacher: Teacher) =>{ 
        return(
         <TeacherItem
          key={teacher.id}
          teacher={teacher}
          favorited={favorites.includes(teacher.id)}
         /> 
         )
        })}
       
        </ScrollView>
        
         </View>
        )
}

export default TeacherList;