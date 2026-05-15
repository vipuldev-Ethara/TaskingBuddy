from rest_framework import serializers
from .models import Project
from apps.authentication.serializers import UserSerializer

class ProjectListSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ('id', 'title', 'deadline', 'status', 'created_by_name', 'member_count', 'created_at')

    def get_member_count(self, obj):
        return obj.members.count()


class ProjectSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'deadline', 'status', 'created_by', 'members', 'created_at', 'updated_at')


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('title', 'description', 'deadline', 'status', 'members')

    def create(self, validated_data):
        members = validated_data.pop('members', [])
        project = Project.objects.create(**validated_data)
        if members:
            project.members.set(members)
        return project

    def update(self, instance, validated_data):
        members = validated_data.pop('members', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if members is not None:
            instance.members.set(members)
        
        return instance
