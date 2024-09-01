from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User


class JWTAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword'
            )
        self.token_url = reverse('token_obtain_pair')
        self.protected_url = reverse('protected_view')

    def test_obtain_jwt_token(self):
        """
        JWT 토큰을 정상적으로 발급받을 수 있는지 테스트합니다.
        """
        response = self.client.post(self.token_url, {
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.access_token = response.data['access']

    def test_access_protected_view_with_jwt(self):
        """
        발급받은 JWT 토큰을 사용하여 보호된 뷰에 접근할 수 있는지 테스트합니다.
        """
        # 먼저 JWT 토큰을 발급받습니다.
        response = self.client.post(self.token_url, {
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']

        # 발급받은 토큰을 사용하여 보호된 뷰에 접근합니다.
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['message'],
            'This is a protected view. You have been authenticated.'
            )

    def test_access_protected_view_without_jwt(self):
        """
        JWT 토큰 없이 보호된 뷰에 접근할 수 없는지 테스트합니다.
        """
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
