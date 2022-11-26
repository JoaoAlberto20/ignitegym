import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { FlatList, Heading, HStack, Text, VStack } from "native-base";

import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";
import { AppNavigationRoutesProps } from "@routes/app.routes";

export function Home() {
  const [groups, setGroups] = useState(['Costa', 'Bíceps', 'Triceps', 'Ombro'])
  const [exercises, setExercises] = useState(['Puxada Fontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terras'])
  const [groupSelected, setGroupSelected] = useState('costa');

  const navigation = useNavigation<AppNavigationRoutesProps>();

  const handleOpenExerciseDetails = () => navigation.navigate('exercise')


  return (
    <VStack flex={1} >
      <HomeHeader />
      <FlatList 
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group 
            name={item}
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />
      <VStack flex={1} px={8} >
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md" fontFamily="heading">
            Exercícios
          </Heading>
          <Text color="gray.200" fontSize="sm">
           {exercises.length}
          </Text>
        </HStack>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <ExerciseCard
              onPress={handleOpenExerciseDetails} 
            />
          )}
          _contentContainerStyle={{
            paddingBottom: 20
          }}
          showsVerticalScrollIndicator={false}
        />
      </VStack>
    </VStack>
  )
}