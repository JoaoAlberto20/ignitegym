import { useCallback, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { AppNavigationRoutesProps } from "@routes/app.routes";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { FlatList, Heading, HStack, Text, VStack, useToast } from "native-base";

import { Group } from "@components/Group";
import { Loading } from "@components/Loading";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseCard } from "@components/ExerciseCard";

import { ExercisesDTO } from "@dtos/ExercisesDTO";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExercisesDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState('antebraço');

  const navigation = useNavigation<AppNavigationRoutesProps>();
  const toast = useToast();

  const handleOpenExerciseDetails = (exerciseId: string) =>  {
    navigation.navigate('exercise', { exerciseId });
  };

  const fetchGroups = async () => {
    try {
      const { data } = await api.get('/groups');
      setGroups(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title =  isAppError ? error.message : 'Não foi carregar os grupos musculares.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    };
  };

  const fetchExercisesByGroup = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title =  isAppError ? error.message : 'Não foi carregar os exercícios.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    };
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup();
  }, [groupSelected]));


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
      {
        isLoading ? (
          <Loading />
        ) : (
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
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ExerciseCard
                  exercises={item}
                  onPress={() => handleOpenExerciseDetails(item.id)} 
                />
              )}
              _contentContainerStyle={{
                paddingBottom: 20
              }}
              showsVerticalScrollIndicator={false}
            />
          </VStack>
        )
      }
    </VStack>
  )
}