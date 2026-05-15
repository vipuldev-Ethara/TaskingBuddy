from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LogoutView, ProfileView, UserListView, UserDetailView, ChangePasswordView, InviteUserView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('profile/', ProfileView.as_view(), name='auth_profile'),
    path('users/', UserListView.as_view(), name='auth_users'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='auth_user_detail'),
    path('change-password/', ChangePasswordView.as_view(), name='auth_change_password'),
    path('users/invite/', InviteUserView.as_view(), name='auth_invite_user'),
]
