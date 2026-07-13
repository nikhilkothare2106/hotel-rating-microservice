curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.30.2 TARGET_ARCH=x86_64 sh -
cd istio-1.30.2
export PATH=$PWD/bin:$PATH
istioctl version

istioctl install --set profile=demo -y

kubectl get pods -n istio-system

kubectl label namespace dev istio-injection=enabled
kubectl get namespace dev --show-labels

istioctl analyze -n dev

kubectl get svc istio-ingressgateway -n istio-system

kubectl apply -f samples/addons
kubectl rollout status deployment/kiali -n istio-system

istioctl dashboard kiali