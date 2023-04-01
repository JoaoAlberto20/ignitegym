import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { Heading, SectionList, Text, useToast, VStack } from "native-base";

import { AppError } from "@utils/AppError";
import { api } from "@services/api";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Loading } from "@components/Loading";
import { HistoryGroupByDayDTO } from "@dtos/HistoryGroupByDayDTO";

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [exerciseHistory, setExercisesHistory] = useState<HistoryGroupByDayDTO[]>([]);

  const toast = useToast();

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/history');
      setExercisesHistory(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    };
  };

  useFocusEffect(useCallback(() => {
    fetchHistory();
  }, []))

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />
      {
        isLoading ? (
          <Loading />
        ) : (
          <SectionList
            sections={exerciseHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <HistoryCard 
                history={item}
              />
            )}
            renderSectionHeader={({ section }) => (
              <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading" >
                {section.title}
              </Heading>
            )}
            px={8}
            contentContainerStyle={exerciseHistory.length === 0 && { flex: 1, justifyContent: "center" }}
            ListEmptyComponent={() => (
              <Text color="gray.100" textAlign="center" >
                Não há exercícios registrados ainda. {'\n'}
                Vamos fazer exercícios hoje?
              </Text>
            )}
          />
        )
      }
    </VStack>
  )
}