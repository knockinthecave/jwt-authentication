from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {
            'message': (
                'This is a protected view. You have been authenticated.'
            )
        }
        return Response(content)
