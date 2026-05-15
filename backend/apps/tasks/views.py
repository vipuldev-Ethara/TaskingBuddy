from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q

from .models import Task
from .serializers import TaskSerializer, TaskCreateSerializer, TaskStatusUpdateSerializer
from .filters import TaskFilter

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TaskFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'due_date', 'priority', 'status']
    ordering = ['due_date', '-created_at']

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TaskCreateSerializer
        return TaskSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Task.objects.all()
        # Members can see tasks in their projects
        return Task.objects.filter(project__members=user)

    def perform_create(self, serializer):
        task = serializer.save(created_by=self.request.user)
        
        # Create Activity Log
        from apps.dashboard.models import ActivityLog
        ActivityLog.objects.create(
            user=self.request.user,
            action_type='created',
            description=f'created a new task "{task.title}" in project "{task.project.title}"',
            project=task.project,
            task=task
        )

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.user.role == 'admin':
            return
        
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            # Members can only edit their assigned tasks
            if obj.assigned_to != request.user:
                self.permission_denied(
                    request,
                    message='You do not have permission to edit this task.'
                )

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        task = self.get_object()
        
        if request.user.role != 'admin' and task.assigned_to != request.user:
            return Response(
                {'error': 'You do not have permission to update this task status.'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = TaskStatusUpdateSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(TaskSerializer(task).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
