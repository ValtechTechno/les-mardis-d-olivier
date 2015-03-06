## Deployment

### What's required

You need [ansible](http://ansible.org) 1.7+ installed to be able to deploy automatically.

I used the [Ubuntu instruction](http://docs.ansible.com/intro_installation.html#latest-releases-via-apt-ubuntu) to get the latest version.

### Test the connectivity

To 'ping' the deployment target:

```sh
$ ansible all -i hosts -m ping
```

You need to have your ssh public key installed in the target machine.

The expected success output is:

```python
restau.no-ip.org | success >> {
    "changed": false,
    "ping": "pong"
}

```
