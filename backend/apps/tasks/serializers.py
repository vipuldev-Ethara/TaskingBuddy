from rest_framework import serializers
from .models import Task
from apps.authentication.serializers import UserSerializer
from apps.projects.models import Project

class ProjectSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title')

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    project = ProjectSimpleSerializer(read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = Task
        fields = '__all__'


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('title', 'description', 'priority', 'status', 'due_date', 'project', 'assigned_to', 'attachment')

    def validate(self, data):
        project = data.get('project')
        assigned_to = data.get('assigned_to')

        if assigned_to and project:
            if not project.members.filter(id=assigned_to.id).exists():
                raise serializers.ValidationError({"assigned_to": "Assigned user must be a member of the project."})
        
        return data

    def create(self, validated_data):
        return Task.objects.create(**validated_data)

class TaskStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('status',)
