import { useState } from "react";
import { TouchableOpacity } from "react-native";

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";

import * as IMagePIcker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { UserPhoto } from "@components/UserPhoto";
import { ScreenHeader } from "@components/ScreenHeader";

import { useAuth } from "@hooks/useAuth";

import userPhotoDefaultImg from '@assets/userPhotoDefault.png';


const PHOTO_SIZE = 33;

const schemaProfile = yup.object({
  name: yup
    .string()
    .required('Informe o nome.'),
  password: yup
    .string()
    .min(6, 'A senha dever ter pelo menos 6 dígitos')
    .nullable().transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), null], 'A confirmação da senha não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: yup
      .string()
      .nullable()
      .required('Informe a confirmação da senha')
      .transform((value) => !!value ? value : null)
    }),
});

type FormDataProps = {
  name: string;
  email: string;
  old_password: string;
  password: string;
  confirm_password: string;
};

export function Profile() {
  const { user, updateUserProfile } = useAuth();

  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const toast = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(schemaProfile),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const handleUserPhotoSelect = async () => {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await IMagePIcker.launchImageLibraryAsync({
        mediaTypes: IMagePIcker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });
      if (photoSelected.cancelled) {
        return;
      };
      if (photoSelected.uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.uri);
        if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5 ) {
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
            placement: 'top',
            bgColor: 'red.500',
          });
        };

        const fileExtension = photoSelected.uri.split('.').pop();
        const namePhoto = user.name.replace(/\s+/g, '');
      
        const photoFile = {
          name: `${namePhoto}.${fileExtension}`.toLocaleLowerCase(),
          uri: photoSelected.uri,
          type: `${photoSelected.type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('avatar', photoFile);

        const avatarUpdatedResponse =  await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        });

        toast.show({
          title: 'Foto atualizado',
          placement: 'top',
          bgColor: 'green.700',
        });

        const userUpdate = user;
        userUpdate.avatar = avatarUpdatedResponse.data.avatar;
        updateUserProfile(userUpdate);        
      };
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    };
  };

  const handleProfileUpdate = async (data: FormDataProps) => {
    try {
      setIsUpdating(true);
      
      const userUpdate =  user;
      userUpdate.name = data.name;

      await api.put('/users', data);

      await updateUserProfile(userUpdate);

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.700',
      });

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível atualizar os dados. Tente novamente mais tarde.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsUpdating(false);
    };
  };

  const URL_PHOTO = `${api.defaults.baseURL}/avatar/${user.avatar}`

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10} >
          {
            photoIsLoading ? (
              <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded="full"
                startColor="gray.500"
                endColor="gray.400"
              />
            ) : (
              <UserPhoto
                source={user.avatar ? { uri: URL_PHOTO  } : userPhotoDefaultImg }
                alt="Foto do usuário"
                size={PHOTO_SIZE}
              />
            )
          }
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Controller
            name="name"
            control={control}
            render={({ field: { value,  onChange }}) => (
              <Input
                bgColor="gray.600"
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field: { value,  onChange }}) => (
              <Input
                bgColor="gray.600"
                placeholder="E-mail"
                isDisabled
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </Center>
        <VStack px={10} mt={12} mb={9} >
          <Heading color="gray.200" fontSize="md" mb={2} fontFamily="heading" >
            Alterar senha
          </Heading>
          <Controller
            name="old_password"
            control={control}
            render={({ field: { onChange }}) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange }}) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            name="confirm_password"
            control={control}
            render={({ field: { onChange }}) => (
              <Input
                bg="gray.600"
                placeholder="Confirma a nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />
          <Button 
            mt={4} 
            title="Atualizar"
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating} 
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
};
