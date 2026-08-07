'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Center } from '@astryxdesign/core/Center';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { Heading, Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';

import { useLoginForm } from '../hooks/use-login-form.js';

export function LoginForm() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    usernameStatus,
    passwordStatus,
    submitError,
    isSubmitting,
    handleSubmit,
  } = useLoginForm();

  return (
    <Center axis="both" paddingBlock={10}>
      <VStack gap={4} hAlign="stretch" width={400}>
        <Card padding={8}>
          <form onSubmit={handleSubmit}>
            <VStack gap={4} hAlign="stretch">
              <VStack gap={1} hAlign="center">
                <Heading level={2}>Đăng nhập</Heading>
                <Text type="body" color="secondary" size="sm">
                  Nhập số căn cước công dân và mật khẩu để tiếp tục
                </Text>
              </VStack>

              {submitError ? (
                <Banner status="error" title={submitError} container="card" />
              ) : null}

              <TextInput
                label="Căn cước công dân"
                value={username}
                onChange={setUsername}
                placeholder="Nhập 12 số căn cước công dân"
                size="lg"
                isRequired
                status={usernameStatus}
              />

              <TextInput
                label="Mật khẩu"
                value={password}
                onChange={setPassword}
                placeholder="Nhập mật khẩu"
                type="password"
                size="lg"
                isRequired
                status={passwordStatus}
              />

              <CheckboxInput label="Ghi nhớ đăng nhập" value={rememberMe} onChange={setRememberMe} />

              <Button
                label="Đăng nhập"
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
              />
            </VStack>
          </form>
        </Card>
      </VStack>
    </Center>
  );
}
