from django.urls import path
from rest_framework_simplejwt.views import (
     TokenObtainPairView,
     TokenRefreshView
)
from .views import ProtectedView

urlpatterns = [
    # JWT 토큰 발급 및 갱신 엔드포인트
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # 보호된 뷰 엔드포인트
    path('protected/', ProtectedView.as_view(), name='protected_view'),
]