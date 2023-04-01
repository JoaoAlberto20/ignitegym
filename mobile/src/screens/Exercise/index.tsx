import { useEffect, useState } from "react";

import { TouchableOpacity } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigationRoutesProps } from "@routes/app.routes";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExercisesDTO } from "@dtos/ExercisesDTO";

import { Box, Heading, HStack, Icon, Image, Text, VStack, ScrollView, useToast } from "native-base";
import { Button } from "@components/Button";

import BodySvg from "@assets/body.svg"
import SeriesSvg from "@assets/series.svg"
import { Feather } from '@expo/vector-icons';
import RepetitionsSvg from "@assets/repetitions.svg";
import { Loading } from "@components/Loading";

type RouteParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  const [isLoading, setIsLoading] = useState(true);
  const [sendRegister, setSendRegister] = useState(false);
  const [exercise, setExercise] = useState<ExercisesDTO>({} as ExercisesDTO);

  const navigation = useNavigation<AppNavigationRoutesProps>();
  const routes = useRoute();
  const { exerciseId } = routes.params as RouteParamsProps;

  const toast = useToast();

  const handleGoBack = () => navigation.goBack();

  const fetchExercisesDetails = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/exercises/${exerciseId}`);
      console.log(data);
      setExercise(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi carregar os detalhes do exercícios.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExerciseHistoryRegister = async () => {
    try {
      setSendRegister(true);
      await api.post('/history', { exercise_id: exerciseId });
      toast.show({
        title: 'Parabéns! Exercício registrado no seu histórico.',
        placement: 'top',
        bgColor: 'green.700',
      });

      navigation.navigate('history');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setSendRegister(false);
    }
  };

  useEffect(() => {
    fetchExercisesDetails();
  }, []);

  return (
    <VStack flex={1} >
      <VStack px={8} bg="gray.600" pt={12} >
        <TouchableOpacity onPress={handleGoBack}>
          <Icon
            as={Feather}
            name="arrow-left"
            color="green.500"
            size={6}
          />
        </TouchableOpacity>
        <HStack justifyContent="space-between" mt={3} mb={8} alignItems="center" >
          <Heading color="gray.100" fontSize="lg" flexShrink={1} numberOfLines={1} fontFamily="heading" >
            {exercise.name}
          </Heading>
          <HStack alignItems="center" >
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize" >
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      {
        isLoading ? (
          <Loading />
        ) : (
          <VStack p={8} >
            <Box rounded="lg" mb={3} overflow="hidden">
              <Image
                width="full"
                h={80}
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                }}
                alt={exercise.name}
                resizeMode="cover"
              />
            </Box>
            <Box bg="gray.600" rounded="md" pb={4} px={4} >
              <HStack alignItems="center" justifyContent="space-between" mb={6} mt={5}>
                <HStack >
                  <SeriesSvg />
                  <Text color="gray.200" ml="2" >
                    {exercise.series} Séries
                  </Text>
                </HStack>
                <HStack>
                  <RepetitionsSvg />
                  <Text color="gray.200" ml="2" >
                    {exercise.series} Repetições
                  </Text>
                </HStack>
              </HStack>
              <Button
                title="Marcar como realizado"
                onPress={handleExerciseHistoryRegister}
                isLoading={sendRegister}
              />
            </Box>
          </VStack>
        )
      }
    </VStack>

  )
}