import React, {useState} from 'react';
import {Button, Center, Flex, useColorModeValue, useToast} from "@chakra-ui/react";
import NewsReactForm from "./NewsReactForm";
import {useForm} from "react-hook-form";
import { CHAIN_ID} from "../../utils/Constants";
import FilesUploadModule from "./FilesUploadModule";
import {useNavigate} from "react-router-dom";
import {onSubmitNews} from "../../utils/handlers";
import {useStore} from "../../contexts/AuthContext";


function FormForAddNews() {
    let navigate = useNavigate();
    const toast = useToast()

    const [newUserInfo, setNewUserInfo] = useState({profileImages: []});
    const [files, setFiles] = useState({});
    const {address, chainId, signer, user} = useStore()
    const {handleSubmit, register, formState: {errors, isSubmitting}} = useForm({mode: 'onBlur'});
    const [isLoading, setIsLoading] = useState(false)

    const updateUploadedFiles = (files) =>
        setNewUserInfo({...newUserInfo, profileImages: files});

    const handlerOnClickSubmit = () => {
        if (!(!errors.title && !errors.body)) {
            toast({
                title: "Submitting error",
                description: 'The data you entered is wrong!',
                status: 'error',
                duration: 4000,
                position: 'bottom-right',
                isClosable: true,
            })
        }
    }

    const onSubmit = (data) => {
        onSubmitNews({data, chainId, setIsLoading, files, user, signer, navigate})
    }

    return (
        <Flex p={6}
              h={'100%'}
              maxW={'100%'}
              rounded={'md'}
              boxShadow={'2xl'}
              w={[450, 550, 650]}
              overflow={'hidden'}
              alignItems={'center'}
              flexDirection={'column'}
              bg={useColorModeValue('gray.50', 'gray.900')}>
            {(chainId !== CHAIN_ID || !address) &&
                <Center pr={'15px'}
                        mb={'35px'}
                        mt={'35px'}
                        pl={'15px'}
                        w={[350, 380]}
                        color={'tomato'}
                        rounded={'10px'}
                        fontSize={'20px'}
                        fontWeight={'bold'}
                        textAlign={'center'}
                        border={'1px solid tomato'}>
                    {address ? 'Please connect to EOS Mainnet (EVM) chain!' : 'Please connect to Metamask!'}
                </Center>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex height="full"
                      flexDirection={'column'}
                      alignItems={'center'}>
                    <NewsReactForm errors={errors}
                                   register={register}
                                   isSubmitting={isSubmitting}/>
                    {(chainId === CHAIN_ID && address) &&
                        <FilesUploadModule files={files}
                                           setFiles={setFiles}
                                           updateFilesCb={updateUploadedFiles}/>
                    }
                    <Button size={'md'}
                            mt={'10px'}
                            type='submit'
                            colorScheme='teal'
                            isLoading={isLoading}
                            loadingText='Submitting'
                            onClick={handlerOnClickSubmit}
                            disabled={(chainId !== CHAIN_ID || !address) || isLoading}>
                        Submit
                    </Button>
                </Flex>
            </form>
        </Flex>
    );
}

export default FormForAddNews;
